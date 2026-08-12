import React from "react";

type FieldMode = "date" | "time";

interface DateTimeFieldProps {
  label: string;
  value: Date;
  mode: FieldMode;
  onChange: (date: Date) => void;
  error?: string;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** "YYYY-MM-DD" for <input type="date"> */
function toDateInputValue(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "HH:MM" (24hr) for <input type="time"> */
function toTimeInputValue(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Web counterpart to the native DateTimeField. Rather than reimplementing
 * a picker UI, this leans on the browser's built-in date/time input —
 * it already renders a native calendar / clock picker with zero extra
 * dependencies, and keeps behaviour consistent with the OS the user is on.
 */
export function DateTimeField({ label, value, mode, onChange, error }: DateTimeFieldProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (!raw) return; // user cleared the field — ignore rather than produce an Invalid Date

    if (mode === "date") {
      const [y, m, d] = raw.split("-").map(Number);
      const next = new Date(value);
      next.setFullYear(y, m - 1, d);
      onChange(next);
    } else {
      const [h, min] = raw.split(":").map(Number);
      const next = new Date(value);
      next.setHours(h, min, 0, 0);
      onChange(next);
    }
  }

  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>
      <input
        type={mode}
        value={mode === "date" ? toDateInputValue(value) : toTimeInputValue(value)}
        onChange={handleChange}
        style={{
          ...styles.field,
          ...(error ? styles.fieldError : {}),
        }}
      />
      {error ? <span style={styles.errorText}>{error}</span> : null}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  label: { fontSize: 12, fontWeight: 600, color: "#888780", letterSpacing: 0.6, textTransform: "uppercase" },
  field: {
    border: "0.5px solid #D3D1C7",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 15,
    color: "#2C2C2A",
    backgroundColor: "#FAFAF8",
    fontFamily: "inherit",
    accentColor: "#534AB7", 
    width: "100%",
    boxSizing: "border-box",
  },
  fieldError: { borderColor: "#A32D2D" },
  errorText: { fontSize: 12, color: "#A32D2D", marginTop: 2 },
};