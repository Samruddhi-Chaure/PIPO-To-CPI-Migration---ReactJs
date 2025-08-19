import { useState } from "react";
import upload from "@ui5/webcomponents-icons/dist/upload.js";
import * as XLSX from "xlsx";
import {
    Toolbar, ToolbarSpacer, Button, Title, Bar, Table, Dialog, Input, Label,
    TableRow, TableCell, TableHeaderRow, TableHeaderCell, TableSelectionMulti,
    FileUploader
} from '@ui5/webcomponents-react';

export function UploadPage() {
    const [tableData, setTableData] = useState([]);
    const [open, setOpen] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.detail.files[0]; // FileUploader gives files in event.detail
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
                    <Button design="Emphasized" icon={upload}> Browse </Button>
                </FileUploader>
            </Toolbar>

            {/* Table Content */}
            <Table
                features={<TableSelectionMulti />}
                headerRow={
                    tableData.length > 0 && (
                        <TableHeaderRow sticky>
                            {tableData[0].map((col, index) => (
                                <TableHeaderCell key={index}>
                                    <span>{col}</span>
                                </TableHeaderCell>
                            ))}
                        </TableHeaderRow>
                    )
                }
            >
                {tableData.slice(1).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>
                                <span>{cell}</span>
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </Table>

            {/* Footer */}
            <Bar
                design="Footer"
                style={{
                    position: "fixed",
                    bottom: 0,
                }}
                endContent={
                    <>
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
