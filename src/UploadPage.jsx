import { useRef, useState } from "react";
import upload from "@ui5/webcomponents-icons/dist/upload.js";
import * as XLSX from "xlsx";
import {
    Toolbar,
    ToolbarSpacer,
    Button,
    Title,
    Bar,
    Dialog,
    Input,
    Label,
    FileUploader,
} from "@ui5/webcomponents-react";

// Import native UI5 Web Components for Table
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableRow.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/TableHeaderRow.js";
import "@ui5/webcomponents/dist/TableHeaderCell.js";
import "@ui5/webcomponents/dist/TableSelectionMulti.js";
import "@ui5/webcomponents/dist/Button.js";

export function UploadPage() {
    const [tableData, setTableData] = useState([]);
    const [open, setOpen] = useState(false);

    const selectionRef = useRef(null);

    const handleFileUpload = async (event) => {
        const file = event.detail.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });

                // Get first sheet
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                setTableData(jsonData);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleDelete = () => {
        const selectedSet =
            selectionRef.current?.getSelectedAsSet?.() ?? new Set();
        const selectedKeys = Array.from(selectedSet);

        if (selectedKeys.length === 0) return;

        // Remove rows by keys
        setTableData((prev) => {
            const header = prev[0] || [];
            const body = prev.slice(1);
            const filtered = body.filter(
                (_, idx) => !selectedKeys.includes(`Row${idx + 1}`)
            );
            return [header, ...filtered];
        });

        // clear selection
        if (selectionRef.current) selectionRef.current.selected = "";
    };

    return (
        <>
            {/* Header */}
            <Toolbar>
                <Title level="H1">PIPO To CPI Migration</Title>
                <ToolbarSpacer />
                <FileUploader
                    hideInput
                    placeholder="Choose Excel File"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                >
                    <Button design="Emphasized" icon={upload}>
                        Browse
                    </Button>
                </FileUploader>
            </Toolbar>

            {/* Table Content */}
            <ui5-table>
                <ui5-table-selection-multi
                    ref={selectionRef}
                    slot="features"
                    behavior="RowSelector"
                    header-selector="SelectAll"
                ></ui5-table-selection-multi>

                {tableData.length > 0 && (
                    <ui5-table-header-row slot="headerRow" sticky>
                        {tableData[0].map((col, index) => (
                            <ui5-table-header-cell key={index}>
                                <span>{col}</span>
                            </ui5-table-header-cell>
                        ))}
                    </ui5-table-header-row>
                )}

                {tableData.slice(1).map((row, rowIndex) => (
                    <ui5-table-row key={rowIndex} row-key={`Row${rowIndex + 1}`}>
                        {row.map((cell, cellIndex) => (
                            <ui5-table-cell key={cellIndex}>
                                <span>{cell}</span>
                            </ui5-table-cell>
                        ))}
                    </ui5-table-row>
                ))}
            </ui5-table>



            {/* Footer */}
            <Bar
                design="Footer"
                style={{
                    position: "fixed",
                    bottom: 0,
                }}
                endContent={
                    <>
                        <Button design="Emphasized" onClick={handleDelete} style={{ marginTop: "0.75rem" }}>
                            Delete Selected
                        </Button>
                        <Button design="Emphasized" onClick={() => setOpen(true)}>
                            Enter Package
                        </Button>
                        <Button design="Emphasized">Submit</Button>
                    </>
                }
            />

            {/* Dialog UI */}
            <Dialog
                open={open}
                headerText="Enter Package Details"
                footer={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "0.5rem",
                            width: "100%",
                        }}
                    >
                        <Button design="Emphasized" onClick={() => setOpen(false)}>
                            OK
                        </Button>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </div>
                }
            >
                <div
                    style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    {[
                        { label: "Package Name", placeholder: "Enter package name" },
                        { label: "Description", placeholder: "Enter description" },
                    ].map((field, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <Label required style={{ minWidth: "140px" }}>
                                {field.label}:
                            </Label>
                            <Input style={{ flex: 1 }} placeholder={field.placeholder} />
                        </div>
                    ))}
                </div>
            </Dialog>
        </>
    );
}
