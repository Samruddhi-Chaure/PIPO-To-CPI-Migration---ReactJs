import { useEffect, useRef, useState } from "react";
import upload from "@ui5/webcomponents-icons/dist/upload.js";
import search from "@ui5/webcomponents-icons/dist/search.js";
import deleteIcon from "@ui5/webcomponents-icons/dist/delete.js";
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
    Select,
    Option,
    Table,
    TableRow,
    TableCell,
    TableHeaderRow,
    TableHeaderCell,
} from "@ui5/webcomponents-react";

// Import native UI5 Web Components for Table
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableRow.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/TableHeaderRow.js";
import "@ui5/webcomponents/dist/TableHeaderCell.js";
import "@ui5/webcomponents/dist/TableSelectionMulti.js";

export function UploadPage() {
    const [tableData, setTableData] = useState([]);
    const [open, setOpen] = useState(false);
    const [pkgName, setPkgName] = useState("");
    const [pkgDesc, setPkgDesc] = useState("");
    const [savedPackages, setSavedPackages] = useState([]);
    const [vhdOpen, setVhdOpen] = useState(false); // Value Help Dialog state
    const [viewOpen, setViewOpen] = useState(false); // View Packages Dialog
    const [selectedPackage, setSelectedPackage] = useState("Select");

    // Add this state at the top
    const [tempRows, setTempRows] = useState([]); // rows for current selected package
    const [deletedRows, setDeletedRows] = useState([]); // deleted rows in dialog

    // Update filteredRows for the selected package to populate tempRows when dialog opens or package changes
    useEffect(() => {
        if (selectedPackage === "All") {
            setTempRows(savedPackages.flatMap(pkg => pkg.rows));
        } else {
            const pkg = savedPackages.find(pkg => pkg.name === selectedPackage);
            setTempRows(pkg?.rows ? [...pkg.rows] : []);
        }
        setDeletedRows([]);
    }, [selectedPackage, viewOpen, savedPackages]);


    const selectionRef = useRef(null);

    // Handle Excel upload
    const handleFileUpload = async (event) => {
        const file = event.detail.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                setTableData(jsonData);

                // Clear previously saved packages whenever a new file is chosen
                setSavedPackages([]);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    // Open package dialog
    const handleEnterPackage = () => {
        const selectedSet =
            selectionRef.current?.getSelectedAsSet?.() ?? new Set();
        if (selectedSet.size === 0) {
            alert("Please select at least one row before entering a package.");
            return;
        }
        setOpen(true);
    };

    // Save package
    const handleOk = () => {
        if (!pkgName.trim() || !pkgDesc.trim()) {
            alert("Package Name and Description are mandatory.");
            return;
        }

        const selectedSet = selectionRef.current?.getSelectedAsSet?.() ?? new Set();
        const selectedKeys = Array.from(selectedSet);

        if (selectedKeys.length === 0) {
            setOpen(false);
            return;
        }

        const header = tableData[0] || [];
        const body = tableData.slice(1);

        const selectedRows = body.filter((_, idx) =>
            selectedKeys.includes(`Row${idx + 1}`)
        );
        const remainingRows = body.filter(
            (_, idx) => !selectedKeys.includes(`Row${idx + 1}`)
        );

        setSavedPackages((prev) => {
            const existingIndex = prev.findIndex((pkg) => pkg.name === pkgName);

            if (existingIndex !== -1) {
                // Update existing package
                const updatedPackages = [...prev];
                const existingPackage = updatedPackages[existingIndex];

                // Append new rows without duplicates
                const combinedRows = [
                    ...existingPackage.rows,
                    ...selectedRows.filter(
                        (row) => !existingPackage.rows.some((r) => JSON.stringify(r) === JSON.stringify(row))
                    ),
                ];

                updatedPackages[existingIndex] = {
                    ...existingPackage,
                    name: pkgName,
                    description: pkgDesc,
                    rows: combinedRows,
                };
                return updatedPackages;
            } else {
                // Add new package
                return [...prev, { name: pkgName, description: pkgDesc, rows: selectedRows }];
            }
        });

        setTableData([header, ...remainingRows]);
        setPkgName("");
        setPkgDesc("");
        setOpen(false);

        if (selectionRef.current) selectionRef.current.selected = "";
    };

    // Select package from Value Help
    const handleSelectPackage = (pkg) => {
        setPkgName(pkg.name);
        setPkgDesc(pkg.description);
        setVhdOpen(false);
    };

    // Filter rows for View Dialog
    const filteredRows =
        selectedPackage === "All"
            ? savedPackages.flatMap(pkg => pkg.rows)
            : savedPackages.find(pkg => pkg.name === selectedPackage)?.rows || [];

    return (
        <>
            {/* Header */}
            <Toolbar>
                <Title level="H1">PIPO To CPI Migration</Title>
                <ToolbarSpacer />
                <Button design="Transparent" onClick={() => setViewOpen(true)}>
                    View Packages
                </Button>
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
                        <Button design="Emphasized" onClick={handleEnterPackage}>
                            Enter Package
                        </Button>
                        <Button design="Emphasized">Submit</Button>
                    </>
                }
            />

            {/* Main Dialog */}
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
                        <Button design="Emphasized" onClick={handleOk}>
                            OK
                        </Button>
                        <Button onClick={() => {
                            setOpen(false);
                            setPkgName(""); // Clear package name
                            setPkgDesc(""); // Clear description
                        }}>Close</Button>
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
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Label required style={{ minWidth: "140px" }}>
                            Package Name:
                        </Label>
                        <Input
                            style={{ flex: 1 }}
                            placeholder="Enter package name"
                            value={pkgName}
                            onInput={(e) => setPkgName(e.target.value)}
                        />
                        <Button icon={search} onClick={() => setVhdOpen(true)} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Label required style={{ minWidth: "140px" }}>
                            Description:
                        </Label>
                        <Input
                            style={{ flex: 1 }}
                            placeholder="Enter description"
                            value={pkgDesc}
                            onInput={(e) => setPkgDesc(e.target.value)}
                        />
                    </div>
                </div>
            </Dialog>

            {/* Value Help Dialog */}
            <Dialog
                open={vhdOpen}
                headerText="Select Package"
                footer={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "0.5rem",
                            width: "100%",
                        }}
                    >
                        <Button onClick={() => setVhdOpen(false)}>Close</Button>
                    </div>
                }
            >
                <ui5-table>
                    <ui5-table-header-row slot="headerRow">
                        <ui5-table-header-cell>Package Name</ui5-table-header-cell>
                        <ui5-table-header-cell>Description</ui5-table-header-cell>
                    </ui5-table-header-row>
                    {savedPackages.map((pkg, idx) => (
                        <ui5-table-row key={idx} onClick={() => handleSelectPackage(pkg)}>
                            <ui5-table-cell>{pkg.name}</ui5-table-cell>
                            <ui5-table-cell>{pkg.description}</ui5-table-cell>
                        </ui5-table-row>
                    ))}
                </ui5-table>
            </Dialog>

            {/* View Packages Dialog */}
            <Dialog
                open={viewOpen}
                headerText="View Packages"
                footer={
                    <div style={{ display: "flex", width: "100%" }}>
                        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
                            <Button
                                design="Emphasized"
                                onClick={() => {
                                    setViewOpen(false);
                                    if (deletedRows.length > 0) {
                                        const header = tableData[0] || [];
                                        setTableData([...tableData, ...deletedRows]);

                                        if (selectedPackage === "All") {
                                            setSavedPackages([]);
                                        } else {
                                            setSavedPackages(prev =>
                                                prev.map(pkg =>
                                                    pkg.name === selectedPackage
                                                        ? { ...pkg, rows: pkg.rows.filter(r => !deletedRows.includes(r)) }
                                                        : pkg
                                                )
                                            );
                                        }
                                    }
                                    setDeletedRows([]);
                                    setTempRows([]);
                                    setSelectedPackage("Select");
                                }}
                            >
                                OK
                            </Button>
                            <Button
                                onClick={() => {
                                    setViewOpen(false);
                                    setSelectedPackage("Select");
                                }}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                }

            >
                <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Label style={{ marginBottom: "0.5rem" }}>Select Package:</Label>
                    <Select
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.detail.selectedOption.dataset.type)}
                        style={{ width: "100%" }}
                    >
                        <Option data-type="Select">Select</Option>
                        {/* <Option data-type="All">All</Option> */}
                        {savedPackages.map((pkg, idx) => (
                            <Option key={idx} data-type={pkg.name}>{pkg.name}</Option>
                        ))}
                    </Select>

                    {selectedPackage !== "Select" && selectedPackage !== "" && (
                        <Table
                            headerRow={
                                <TableHeaderRow>
                                    {tableData[0]?.map((col, idx) => (
                                        <TableHeaderCell key={idx}>{col}</TableHeaderCell>
                                    ))}
                                    <TableHeaderCell>Action</TableHeaderCell> {/* New column for Delete */}
                                </TableHeaderRow>
                            }
                            style={{ maxHeight: "50vh", overflow: "auto" }}
                        >
                            {tempRows.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, idx) => (
                                        <TableCell key={idx}>{cell}</TableCell>
                                    ))}
                                    <TableCell>
                                        <Button
                                            icon={deleteIcon}
                                            design="Negative"
                                            onClick={() => {
                                                // Remove row from tempRows and add to deletedRows
                                                const rowToDelete = tempRows[rowIndex];
                                                setTempRows(tempRows.filter((_, i) => i !== rowIndex));
                                                setDeletedRows([...deletedRows, rowToDelete]);
                                            }}
                                        >
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Table>

                    )}
                </div>
            </Dialog>
        </>
    );
}
