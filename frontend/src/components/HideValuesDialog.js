import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { green, brown, gold, hexToRgb, dialogStyles } from '../util/utils';

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
                    textTransform: 'capitalize',
                },
            }}
        >
            <DialogTitle style={dialogStyles.title}>Select Sensors</DialogTitle>
            <DialogContent style={{ padding: '20px' }}> {/*TODO: change font*/}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: '15px' }}>
                    {Object.keys(valueVisibility).map((key) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={valueVisibility[key]}
                                    onChange={() => {
                                        let dict = structuredClone(valueVisibility);
                                        dict[key] = !dict[key];
                                        onChange(dict);
                                    }}
                                    style={{ color: brown}}
                                />
                            }
                            label={key}
                            key={key}
                            style={{ margin: 0, color: 'inherit' }}
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HideValuesDialog;
