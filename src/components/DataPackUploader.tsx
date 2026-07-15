"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { dataPackSlots, DataPackSlotId, NormalizedField, suggestFieldMapping } from "@/lib/data/data-pack";

type UploadedSlotState = {
  fileName: string;
  sheetName: string;
  columns: string[];
  rows: Record<string, unknown>[];
  mapping: Record<string, NormalizedField | "">;
  persistStatus: "local_preview" | "saving" | "saved" | "demo" | "failed";
  persistedFileId?: string;
  persistMessage?: string;
  mappingStatus: "draft" | "saving" | "saved" | "demo" | "failed";
  mappingProfileId?: string;
  mappingMessage?: string;
};

const initialSlotId: DataPackSlotId = "pnl";

interface DataPackUploaderProps {
  caseId: string;
}

export function DataPackUploader({ caseId }: DataPackUploaderProps) {
  const [activeSlotId, setActiveSlotId] = useState<DataPackSlotId>(initialSlotId);
  const [uploads, setUploads] = useState<Partial<Record<DataPackSlotId, UploadedSlotState>>>({});
  const [error, setError] = useState<string | null>(null);
  const activeSlot = dataPackSlots.find((slot) => slot.id === activeSlotId) || dataPackSlots[1];
  const activeUpload = uploads[activeSlotId];

  const requiredSlots = dataPackSlots.filter((slot) => slot.requiredForMvp);
  const uploadedRequired = requiredSlots.filter((slot) => uploads[slot.id]);
  const dataReadiness = Math.round((uploadedRequired.length / requiredSlots.length) * 100);
  const mappedFields = activeUpload ? Object.values(activeUpload.mapping).filter(Boolean).length : 0;
  const mappingReadiness = activeUpload?.columns.length ? Math.round((mappedFields / activeSlot.normalizedFields.length) * 100) : 0;

  const evidencePreview = useMemo(() => {
    if (!activeUpload) return [];
    return Object.entries(activeUpload.mapping)
      .filter(([, field]) => field)
      .slice(0, 6)
      .map(([column, field]) => ({
        source: `${activeUpload.fileName} / ${activeUpload.sheetName}`,
        column,
        field
      }));
  }, [activeUpload]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false }).slice(0, 12);
      const columns = rows[0] ? Object.keys(rows[0]) : [];
      const sheetNames = workbook.SheetNames;

      const mapping = Object.fromEntries(
        columns.map((column) => [column, suggestFieldMapping(column, activeSlot.normalizedFields) || ""])
      ) as Record<string, NormalizedField | "">;

      setUploads((current) => ({
        ...current,
        [activeSlotId]: {
          fileName: file.name,
          sheetName,
          columns,
          rows,
          mapping,
          persistStatus: "saving",
          mappingStatus: "draft"
        }
      }));

      await persistUpload({
        file,
        slot: activeSlotId,
        sheetNames,
        columns,
        rows
      });
    } catch (cause) {
      const details = cause instanceof Error ? cause.message : "Неизвестная ошибка";
      setError(`Не удалось прочитать файл: ${details}`);
    } finally {
      event.target.value = "";
    }
  }

  async function persistUpload(input: {
    file: File;
    slot: DataPackSlotId;
    sheetNames: string[];
    columns: string[];
    rows: Record<string, unknown>[];
  }) {
    const body = new FormData();
    body.set("file", input.file);
    body.set("slot", input.slot);
    body.set("sheetNamesJson", JSON.stringify(input.sheetNames));
    body.set("detectedColumnsJson", JSON.stringify(input.columns));
    body.set("previewRowsJson", JSON.stringify(input.rows));

    try {
      const response = await fetch(`/api/cases/${caseId}/uploads`, {
        method: "POST",
        body
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload persistence failed");
      }

      setUploads((current) => {
        const upload = current[input.slot];
        if (!upload) return current;
        return {
          ...current,
          [input.slot]: {
            ...upload,
            persistStatus: result.persisted ? "saved" : "demo",
            persistedFileId: result.uploadedFile?.id || `demo_${input.slot}`,
            persistMessage: result.persisted ? "Сохранено в private storage" : "Demo preview: raw file не сохранен"
          }
        };
      });
    } catch (cause) {
      const details = cause instanceof Error ? cause.message : "Неизвестная ошибка";
      setUploads((current) => {
        const upload = current[input.slot];
        if (!upload) return current;
        return {
          ...current,
          [input.slot]: {
            ...upload,
            persistStatus: "failed",
            persistMessage: details
          }
        };
      });
    }
  }

  function setMapping(column: string, field: NormalizedField | "") {
    setUploads((current) => {
      const upload = current[activeSlotId];
      if (!upload) return current;
      return {
        ...current,
        [activeSlotId]: {
          ...upload,
          mapping: {
            ...upload.mapping,
            [column]: field
          },
          mappingStatus: "draft",
          mappingMessage: undefined
        }
      };
    });
  }

  async function saveMapping() {
    if (!activeUpload) return;
    const fileId = activeUpload.persistedFileId || `demo_${activeSlotId}`;

    setUploads((current) => {
      const upload = current[activeSlotId];
      if (!upload) return current;
      return {
        ...current,
        [activeSlotId]: {
          ...upload,
          mappingStatus: "saving",
          mappingMessage: "Сохраняем mapping"
        }
      };
    });

    try {
      const response = await fetch(`/api/cases/${caseId}/uploads/${fileId}/mapping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          slot: activeSlotId,
          sourceSheet: activeUpload.sheetName,
          confidence: mappingReadiness,
          columnMapping: activeUpload.mapping
        })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Mapping persistence failed");
      }

      setUploads((current) => {
        const upload = current[activeSlotId];
        if (!upload) return current;
        return {
          ...current,
          [activeSlotId]: {
            ...upload,
            mappingStatus: result.persisted ? "saved" : "demo",
            mappingProfileId: result.mappingProfile?.id,
            mappingMessage: result.persisted ? "Mapping сохранен в Postgres" : "Demo mapping: будет сохранен после подключения базы"
          }
        };
      });
    } catch (cause) {
      const details = cause instanceof Error ? cause.message : "Неизвестная ошибка";
      setUploads((current) => {
        const upload = current[activeSlotId];
        if (!upload) return current;
        return {
          ...current,
          [activeSlotId]: {
            ...upload,
            mappingStatus: "failed",
            mappingMessage: details
          }
        };
      });
    }
  }

  return (
    <section className="upload-workspace">
      <aside className="panel">
        <div className="panel-head">
          <h2>Data pack slots</h2>
          <span className="label info">{uploadedRequired.length}/{requiredSlots.length}</span>
        </div>
        <div className="panel-body stack">
          <div className="readiness-meter">
            <div>
              <strong>{dataReadiness}/100</strong>
              <span>{uploadedRequired.length === requiredSlots.length ? "Достаточно для MVP-анализа" : "Не хватает обязательных источников"}</span>
            </div>
            <div className="meter-track"><span style={{ width: `${dataReadiness}%` }} /></div>
          </div>
          {dataPackSlots.map((slot) => (
            <button
              className={`slot-button ${slot.id === activeSlotId ? "active" : ""} ${uploads[slot.id] ? "received" : ""}`}
              key={slot.id}
              onClick={() => setActiveSlotId(slot.id)}
              type="button"
            >
              <span>
                <strong>{slot.shortTitle}</strong>
                <small>{slot.requiredForMvp ? "required" : "optional"}</small>
              </span>
              <em>{uploads[slot.id] ? "получено" : "ожидается"}</em>
            </button>
          ))}
        </div>
      </aside>

      <main className="panel">
        <div className="panel-head">
          <div>
            <h2>{activeSlot.title}</h2>
            <p>{activeSlot.why}</p>
          </div>
          <span className="label medium">{activeSlot.acceptedFormats}</span>
        </div>
        <div className="panel-body stack">
          <div className="upload-dropzone">
            <div>
              <strong>Загрузить файл в слот</strong>
              <p>На тестировании файл читается в браузере: мы показываем preview, предлагаем mapping и считаем readiness. В production этот шаг будет сохранять raw file + normalized model.</p>
            </div>
            <label className="button primary">
              Выбрать файл
              <input hidden type="file" accept=".xlsx,.csv" onChange={handleFile} />
            </label>
          </div>

          {error ? <div className="note high">{error}</div> : null}

          {activeUpload ? (
            <>
              <div className="ingestion-summary">
                <div className="metric"><span>Файл</span><strong>{activeUpload.fileName}</strong></div>
                <div className="metric"><span>Лист</span><strong>{activeUpload.sheetName}</strong></div>
                <div className="metric"><span>Mapping readiness</span><strong>{mappingReadiness}%</strong></div>
                <div className="metric">
                  <span>Persist status</span>
                  <strong>{activeUpload.persistStatus}</strong>
                  {activeUpload.persistMessage ? <small>{activeUpload.persistMessage}</small> : null}
                </div>
                <div className="metric">
                  <span>Mapping status</span>
                  <strong>{activeUpload.mappingStatus}</strong>
                  {activeUpload.mappingMessage ? <small>{activeUpload.mappingMessage}</small> : null}
                </div>
              </div>

              <section className="mapping-grid">
                <div>
                  <h3>Mapping columns to finance model</h3>
                  <div className="mapping-list">
                    {activeUpload.columns.map((column) => (
                      <label className="mapping-row" key={column}>
                        <span>{column}</span>
                        <select value={activeUpload.mapping[column] || ""} onChange={(event) => setMapping(column, event.target.value as NormalizedField | "")}>
                          <option value="">Не использовать</option>
                          {activeSlot.normalizedFields.map((field) => <option value={field} key={field}>{field}</option>)}
                        </select>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="section-head-inline">
                    <h3>Evidence preview</h3>
                    <button type="button" onClick={saveMapping} disabled={activeUpload.mappingStatus === "saving" || !mappedFields}>
                      Сохранить mapping
                    </button>
                  </div>
                  <div className="stack">
                    {evidencePreview.length ? evidencePreview.map((item) => (
                      <div className="evidence-chip" key={`${item.column}-${item.field}`}>
                        <strong>{item.field}</strong>
                        <span>{item.source}</span>
                        <span className="mono">{item.column}</span>
                      </div>
                    )) : <p>Подтвердите mapping, чтобы создать evidence items.</p>}
                  </div>
                </div>
              </section>

              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>{activeUpload.columns.slice(0, 8).map((column) => <th key={column}>{column}</th>)}</tr>
                  </thead>
                  <tbody>
                    {activeUpload.rows.slice(0, 6).map((row, index) => (
                      <tr key={index}>
                        {activeUpload.columns.slice(0, 8).map((column) => <td key={column}>{String(row[column] ?? "")}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <strong>Файл еще не загружен</strong>
              <p>Для первого теста используйте sample template или любой Excel с заголовками колонок. Система попробует распознать поля автоматически.</p>
            </div>
          )}
        </div>
      </main>
    </section>
  );
}
