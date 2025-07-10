import React, { useState } from "react";
import { Search, Down, Right } from "@bigbinary/neeto-icons";
import { Button, Input } from "@bigbinary/neetoui";

// Simplified JsonViewer component with clean, minimal design
const JsonViewer = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("tree"); // 'tree' or 'raw'

  // Simple JsonNode component with minimal styling
  const JsonNode = ({ value, path = "", depth = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(depth < 2);

    const isObject = typeof value === "object" && value !== null;
    const isArray = Array.isArray(value);
    const isEmpty = isObject && Object.keys(value).length === 0;

    // Simple search highlighting
    const isSearchMatch = searchTerm &&
      (path.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())));

    // Simplified color scheme
    const getValueColor = (val) => {
      if (val === null) return "#EF4444";
      if (typeof val === "string") return "#22C55E";
      if (typeof val === "number") return "#F59E0B";
      if (typeof val === "boolean") return "#8B5CF6";
      return "#111827";
    };

    // Render primitive values
    if (!isObject) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "2px 4px",
            backgroundColor: isSearchMatch ? "#FEF3C7" : "transparent",
            borderRadius: "4px",
            paddingLeft: `${depth * 16}px`,
          }}
        >
          <span
            style={{
              color: getValueColor(value),
              fontFamily: "monospace",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {typeof value === "string" ? `"${value}"` : String(value)}
          </span>
        </div>
      );
    }

    const entries = isArray ?
      value.map((item, index) => [index, item]) :
      Object.entries(value);

    return (
      <div style={{ paddingLeft: depth > 0 ? `${depth * 16}px` : "0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px",
            cursor: isEmpty ? "default" : "pointer",
            backgroundColor: isSearchMatch ? "#FEF3C7" : "transparent",
            borderRadius: "4px",
          }}
          onClick={() => !isEmpty && setIsExpanded(!isExpanded)}
        >
          {!isEmpty && (
            <span style={{ color: "#6B7280", fontSize: "12px" }}>
              {isExpanded ? <Down size={12} /> : <Right size={12} />}
            </span>
          )}
          <span style={{
            color: "#111827",
            fontSize: "13px",
            fontWeight: 600,
          }}>
            {isArray ? `Array[${value.length}]` : `Object{${Object.keys(value).length}}`}
          </span>
        </div>

        {!isEmpty && isExpanded && (
          <div style={{ marginTop: "4px" }}>
            {entries.map(([key, val], index) => {
              const currentPath = path ? `${path}.${key}` : String(key);
              return (
                <div key={currentPath} style={{ marginBottom: "2px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    paddingLeft: "16px"
                  }}>
                    <span style={{
                      color: "#3B82F6",
                      fontSize: "12px",
                      fontWeight: 600,
                      minWidth: "fit-content",
                    }}>
                      {isArray ? `[${key}]` : `${key}:`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <JsonNode
                        value={val}
                        path={currentPath}
                        depth={depth + 1}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      border: "1px solid #E5E7EB",
      borderRadius: "8px",
      backgroundColor: "#FFFFFF",
      overflow: "hidden"
    }}>
      {/* Simplified header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid #E5E7EB",
        backgroundColor: "#F9FAFB",
        display: "flex",
        gap: "12px",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <Button
            label="Tree"
            variant={viewMode === "tree" ? "primary" : "secondary"}
            size="small"
            onClick={() => setViewMode("tree")}
          />
          <Button
            label="Raw"
            variant={viewMode === "raw" ? "primary" : "secondary"}
            size="small"
            onClick={() => setViewMode("raw")}
          />
        </div>

        {viewMode === "tree" && (
          <div style={{ flex: 1, maxWidth: "200px" }}>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              size="small"
              prefix={<Search size={14} />}
            />
          </div>
        )}
      </div>

      {/* Content area */}
      <div style={{
        padding: "16px",
        maxHeight: "400px",
        overflow: "auto",
        backgroundColor: "#FFFFFF"
      }}>
        {viewMode === "tree" ? (
          <JsonNode value={data} />
        ) : (
          <pre style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: "12px",
            lineHeight: 1.5,
            color: "#111827",
            fontFamily: "monospace",
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;
