import upload from "@ui5/webcomponents-icons/dist/upload.js";
import {Bar , Page,Table, Title, Button} from '@ui5/webcomponents-react';
import {TableRow,TableCell,TableHeaderRow,TableHeaderCell,TableSelectionMulti } from '@ui5/webcomponents-react';

export function UploadPage() {
  return (
    
        // <Page
        //     backgroundDesign="Solid"
        //     footer={<Bar design="fixedFooter" endContent={<><Button design="Emphasized">Enter Package</Button><Button design="Emphasized">Submit</Button></>} />}
        //     header={
        //         <Bar startContent={<Title level="H6" style={{padding: "var(--sapContent_Space_S)"}}> PI/PO To CPI Migration </Title>}
        //              endContent={<Button design="Emphasized" icon= {upload} onClick={function _ie(){}} > Browse </Button>}
        //         >
        //         </Bar>}
        //     style={{
        //         padding: '0px',
        //         margin: '0px',
        //         height: "589px"
        //     }}
        // >
        //         <Table
        //             features={<TableSelectionMulti />}
        //             headerRow={
        //                 <TableHeaderRow sticky>
        //                     <TableHeaderCell ><span>Product</span></TableHeaderCell>
        //                     <TableHeaderCell ><span>Supplier</span></TableHeaderCell>
        //                 </TableHeaderRow>
        //             }
        //             onMove={function _ie(){}}
        //             onMoveOver={function _ie(){}}
        //             onRowActionClick={function _ie(){}}
        //             onRowClick={function _ie(){}}
        //         >
        //             <TableRow rowKey="0">
        //                 <TableCell>
        //                     <span>
        //                         Notebook Basic
        //                     </span>
        //                 </TableCell>
        //                 <TableCell>
        //                     <span>
        //                         Very Best Screens
        //                     </span>
        //                 </TableCell>
        //             </TableRow>
        //                 <TableRow rowKey="1">
        //                     <TableCell>
        //                         <span>
        //                             Notebook Basic 17HT-1001
        //                         </span>
        //                     </TableCell>
        //                     <TableCell>
        //                         <span>
        //                             Very Best Screens
        //                         </span>
        //                     </TableCell>
        //                 </TableRow>
        //         </Table> 
            
        // </Page>
    
    <div>
        <Title level="H6" style={{padding: "var(--sapContent_Space_S)"}}>
            PI/PO To CPI Migration
        </Title>
        <Button
            design="Emphasized"
            icon= {upload}
            onClick={function _ie(){}}
        >
            Browse
        </Button>
        <Table
            features={<TableSelectionMulti />}
            headerRow={
                <TableHeaderRow sticky>
                    <TableHeaderCell ><span>Product</span></TableHeaderCell>
                    <TableHeaderCell ><span>Supplier</span></TableHeaderCell>
                </TableHeaderRow>
            }
            onMove={function _ie(){}}
            onMoveOver={function _ie(){}}
            onRowActionClick={function _ie(){}}
            onRowClick={function _ie(){}}
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
    </div>
    )
}