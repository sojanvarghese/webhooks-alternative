import React, { useState, useMemo, useCallback } from "react";
import { Input, Button } from "@bigbinary/neetoui";
import { Search, Down, Right, Copy } from "@bigbinary/neeto-icons";

const JsonViewer = ({ data, maxDisplaySize = 1000 }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPaths, setExpandedPaths] = useState(new Set());
  const [showRaw, setShowRaw] = useState(false);

  // Convert data to string and calculate size
  const jsonString = useMemo(() => {
    if (typeof data === "string") {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  }, [data]);

  const dataSize = jsonString.length;
  const isLarge = dataSize > maxDisplaySize;

  // Parse the JSON for tree rendering
  const parsedData = useMemo(() => {
    try {
      if (typeof data === "string") {
        return JSON.parse(data);
      }
      return data;
    } catch {
      return data;
    }
  }, [data]);

  // Statistics for large data
  const stats = useMemo(() => {
    if (!isLarge) return null;

    const calculateStats = (obj, path = "") => {
      let stats = { objects: 0, arrays: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0, maxDepth: 0 };

      const traverse = (item, currentPath, depth = 0) => {
        stats.maxDepth = Math.max(stats.maxDepth, depth);

        if (item === null) {
          stats.nulls++;
        } else if (typeof item === "boolean") {
          stats.booleans++;
        } else if (typeof item === "number") {
          stats.numbers++;
        } else if (typeof item === "string") {
          stats.strings++;
        } else if (Array.isArray(item)) {
          stats.arrays++;
          item.forEach((subItem, index) => {
            traverse(subItem, `${currentPath}[${index}]`, depth + 1);
          });
        } else if (typeof item === "object") {
          stats.objects++;
          Object.keys(item).forEach(key => {
            traverse(item[key], `${currentPath}.${key}`, depth + 1);
          });
        }
      };

      traverse(obj);
      return stats;
    };

    return calculateStats(parsedData);
  }, [parsedData, isLarge]);

  // Toggle expansion of a path
  const togglePath = useCallback((path) => {
    setExpandedPaths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  // Search functionality
  const highlightSearch = useCallback((text) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background-color: yellow; padding: 2px 4px; border-radius: 2px;">$1</mark>');
  }, [searchTerm]);

  // Render a JSON node recursively
  const renderJsonNode = useCallback((value, key, path = "", depth = 0) => {
    const currentPath = path ? `${path}.${key}` : key;
    const isExpanded = expandedPaths.has(currentPath);

    if (value === null) {
      return (
        <div key={currentPath} style={{ marginLeft: `${depth * 20}px` }}>
          <span className="json-key">{key && `"${key}": `}</span>
          <span className="json-null">null</span>
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <div key={currentPath} style={{ marginLeft: `${depth * 20}px` }}>
          <span className="json-key">{key && `"${key}": `}</span>
          <span className="json-boolean">{value.toString()}</span>
        </div>
      );
    }

    if (typeof value === "number") {
      return (
        <div key={currentPath} style={{ marginLeft: `${depth * 20}px` }}>
          <span className="json-key">{key && `"${key}": `}</span>
          <span className="json-number">{value}</span>
        </div>
      );
    }

    if (typeof value === "string") {
      const highlighted = highlightSearch(value);
      return (
        <div key={currentPath} style={{ marginLeft: `${depth * 20}px` }}>
          <span className="json-key">{key && `"${key}": `}</span>
          <span
            className="json-string"
            dangerouslySetInnerHTML={{ __html: `"${highlighted}"` }}
          />
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={currentPath} style={{ marginLeft: `${depth * 20}px` }}>
                  <div
          className="json-expandable"
          onClick={() => togglePath(currentPath)}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
        >
          {isExpanded ? <Down size={16} /> : <Right size={16} />}
          <span className="json-key">{key && `"${key}": `}</span>
          <span className="json-bracket">[</span>
          {!isExpanded && <span className="json-info">{value.length} items</span>}
          {!isExpanded && <span className="json-bracket">]</span>}
        </div>
          {isExpanded && (
            <div>
              {value.map((item, index) => renderJsonNode(item, index, currentPath, depth + 1))}
              <div style={{ marginLeft: `${depth * 20}px` }}>
                <span className="json-bracket">]</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (typeof value === "object") {
      const keys = Object.keys(value);
      return (
        <div key={currentPath} style={{ marginLeft: `${depth * 20}px` }}>
                  <div
          className="json-expandable"
          onClick={() => togglePath(currentPath)}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
        >
          {isExpanded ? <Down size={16} /> : <Right size={16} />}
          <span className="json-key">{key && `"${key}": `}</span>
          <span className="json-bracket">{"{"}</span>
          {!isExpanded && <span className="json-info">{keys.length} keys</span>}
          {!isExpanded && <span className="json-bracket">{"}"}</span>}
        </div>
          {isExpanded && (
            <div>
              {keys.map(objKey => renderJsonNode(value[objKey], objKey, currentPath, depth + 1))}
              <div style={{ marginLeft: `${depth * 20}px` }}>
                <span className="json-bracket">{"}"}</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  }, [expandedPaths, highlightSearch, togglePath]);

  // Copy to clipboard
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(jsonString);
  }, [jsonString]);

  // Expand/collapse all
  const expandAll = useCallback(() => {
    const getAllPaths = (obj, path = "", paths = new Set()) => {
      if (typeof obj === "object" && obj !== null) {
        if (Array.isArray(obj)) {
          paths.add(path);
          obj.forEach((item, index) => {
            getAllPaths(item, `${path}[${index}]`, paths);
          });
        } else {
          paths.add(path);
          Object.keys(obj).forEach(key => {
            getAllPaths(obj[key], path ? `${path}.${key}` : key, paths);
          });
        }
      }
      return paths;
    };

    setExpandedPaths(getAllPaths(parsedData));
  }, [parsedData]);

  const collapseAll = useCallback(() => {
    setExpandedPaths(new Set());
  }, []);

  return (
    <div className="json-viewer">
      <style>{`
        .json-viewer {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          line-height: 1.4;
        }
        .json-key {
          color: #0066cc;
          font-weight: 600;
        }
        .json-string {
          color: #4CAF50;
        }
        .json-number {
          color: #ff9500;
        }
        .json-boolean {
          color: #ff5722;
        }
        .json-null {
          color: #9e9e9e;
        }
        .json-bracket {
          color: #666;
          font-weight: 600;
        }
        .json-info {
          color: #888;
          font-style: italic;
          font-size: 12px;
          margin-left: 8px;
        }
        .json-expandable:hover {
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        .json-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
          align-items: center;
        }
        .json-stats {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 12px;
        }
        .json-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
        }
        .json-content {
          background: #fafafa;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          max-height: 500px;
          overflow-y: auto;
        }
        .json-raw {
          white-space: pre-wrap;
          word-break: break-all;
        }
      `}</style>

      <div className="json-controls">
        <div style={{ flex: 1, maxWidth: 300 }}>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search JSON..."
            prefix={<Search size={16} />}
            size="small"
          />
        </div>
        <Button
          variant="secondary"
          size="small"
          onClick={expandAll}
          label="Expand All"
        />
        <Button
          variant="secondary"
          size="small"
          onClick={collapseAll}
          label="Collapse All"
        />
        <Button
          variant="secondary"
          size="small"
          onClick={() => setShowRaw(!showRaw)}
          label={showRaw ? "Tree View" : "Raw View"}
        />
        <Button
          variant="secondary"
          size="small"
          onClick={handleCopy}
          icon={Copy}
          label="Copy"
        />
      </div>

      {isLarge && stats && (
        <div className="json-stats">
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            Large Dataset Statistics ({(dataSize / 1024).toFixed(1)}KB)
          </div>
          <div className="json-stats-grid">
            <div>Objects: {stats.objects}</div>
            <div>Arrays: {stats.arrays}</div>
            <div>Strings: {stats.strings}</div>
            <div>Numbers: {stats.numbers}</div>
            <div>Booleans: {stats.booleans}</div>
            <div>Nulls: {stats.nulls}</div>
            <div>Max Depth: {stats.maxDepth}</div>
          </div>
        </div>
      )}

      <div className="json-content">
        {showRaw ? (
          <pre className="json-raw">{jsonString}</pre>
        ) : (
          <div>
            {renderJsonNode(parsedData, "", "", 0)}
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;
