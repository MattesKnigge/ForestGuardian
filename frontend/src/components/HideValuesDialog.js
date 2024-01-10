import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { green, gold, hexToRgb, dialogStyles } from '../util/utils';

const HideValuesDialog = ({ open, onClose, valueVisibility, onChange }) => {
    const rgbGreen = hexToRgb(green);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: `rgba(${rgbGreen.join(', ')}, 0.7)`,
                    color: gold,
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)',
                },
            }}
        >
            <DialogTitle style={dialogStyles.title}>Welcome to ForestGuardian</DialogTitle>
            <DialogContent>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                    {Object.keys(valueVisibility).map((key) => (
                        <>
                            <div>{key}</div> <input type="checkbox" checked={valueVisibility[key]} onChange={() => {
                                let dict = structuredClone(valueVisibility);
                                dict[key] = !dict[key]
                                onChange(dict);
                            }} />
                        </>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default HideValuesDialog;
