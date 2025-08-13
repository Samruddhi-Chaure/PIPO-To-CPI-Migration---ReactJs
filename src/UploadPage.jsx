import React, { useRef, useState } from "react";
import upload from "@ui5/webcomponents-icons/dist/upload.js";
import * as XLSX from "xlsx";
import { Toolbar, ToolbarSpacer, Button, Title, Bar, Page, Table, Text, Dialog, Input,Label} from '@ui5/webcomponents-react';
import { TableRow, TableCell, TableHeaderRow, TableHeaderCell, TableSelectionMulti } from '@ui5/webcomponents-react';

export function UploadPage() {
    //const fileInputRef = useRef(null);
    const [open, setOpen] = useState(false);
    return (
        <>
            <Toolbar>
                <Title level="H1">PIPO To CPI Migration</Title>
                <ToolbarSpacer />
                <Button design="Emphasized" icon={upload}>Browse</Button>
            </Toolbar>
            <Table
                features={<TableSelectionMulti />}
                headerRow={
                    <TableHeaderRow sticky>
                        <TableHeaderCell ><span>Product</span></TableHeaderCell>
                        <TableHeaderCell ><span>Supplier</span></TableHeaderCell>
                    </TableHeaderRow>
                }
                onMove={function _ie() { }}
                onMoveOver={function _ie() { }}
                onRowActionClick={function _ie() { }}
                onRowClick={function _ie() { }}
            >
                <TableRow rowKey="0">
                    <TableCell>
                        <span>
                            Notebook Basic
                        </span>
                    </TableCell>
                    <TableCell>
                        <span>
                            Very Best Screens
                        </span>
                    </TableCell>
                </TableRow>
                <TableRow rowKey="1">
                    <TableCell>
                        <span>
                            Notebook Basic 17HT-1001
                        </span>
                    </TableCell>
                    <TableCell>
                        <span>
                            Very Best Screens
                        </span>
                    </TableCell>
                </TableRow>
            </Table>
            <Bar
                design="Footer"
                style={{
                    position: "fixed",
                    bottom: 0,
                }}
                endContent={
                    <>
                        <Button design="Emphasized" onClick={() => setOpen(true)}>Enter Package</Button>
                        <Button design="Emphasized">Submit</Button>
                    </>
                }
            />

            {/* Dialog UI */}
            <Dialog
                open={open}
                headerText="Enter Package Details"
                footer={
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", width: "100%" }}>
                    <Button design="Emphasized" onClick={() => setOpen(false)}>OK</Button>
                    <Button design="Emphasized" onClick={() => setOpen(false)}>
                    Close
                    </Button>
                </div>
                }
            >
                <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Label required style={{ minWidth: "140px" }}>Package Name:</Label>
                    <Input style={{ flex: 1 }} placeholder="Enter package name" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Label required style={{ minWidth: "140px" }}>Description:</Label>
                    <Input style={{ flex: 1 }} placeholder="Enter description" />
                </div>
                </div>
            </Dialog>
        </>
    )
}