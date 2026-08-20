import React from 'react';
import { FaChevronLeft, FaTimes } from 'react-icons/fa';
import joyoryLogo from "../../../assets/Logo.png";

export default function VtoInstructionsModal({
    showExitConfirm,
    onCancelExit,
    onConfirmExit,
    onInstrBack,
    onInstrClose,
    fileInputRef,
    onPhotoUpload,
}) {
    return (
        <div className="vto-instructions-screen">
            <div className="vto-instr-card">
                {/* Confirm Exit Dialog */}
                {showExitConfirm && (
                    <div className="vto-exit-confirm-overlay">
                        <div className="vto-exit-confirm-box">
                            <div className="vto-exit-confirm-icon">✕</div>
                            <h3 className="vto-exit-confirm-title">Leave Try-On?</h3>
                            <p className="vto-exit-confirm-msg">Are you sure you want to exit? Your current session will not be saved.</p>
                            <div className="vto-exit-confirm-actions">
                                <button className="vto-exit-btn-cancel" onClick={onCancelExit}>Stay</button>
                                <button className="vto-exit-btn-confirm" onClick={onConfirmExit}>Yes, Exit</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="vto-instr-header">
                    <button className="vto-instr-icon-btn vto-instr-back-btn" onClick={onInstrBack} title="Go Back">
                        <FaChevronLeft />
                    </button>
                    <div className="vto-instr-brand">
                        <img src={joyoryLogo} alt="Joyory" className="vto-instr-logo" />
                    </div>
                    <button className="vto-instr-icon-btn vto-instr-close-btn" onClick={onInstrClose} title="Exit">
                        <FaTimes />
                    </button>
                </div>
                <div className="vto-instr-content">
                    <h2 className="vto-instr-title">PHOTO INSTRUCTIONS</h2>
                    <p className="vto-instr-subtitle">
                        For the best virtual try-on experience, please follow these simple guidelines when taking or selecting your photo.
                    </p>
                    <div className="vto-instr-list">
                        <div className="vto-instr-item">
                            <div className="vto-instr-icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <p>Use a Photo that is of the face straight on.</p>
                        </div>
                        <div className="vto-instr-item">
                            <div className="vto-instr-icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
                                    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </div>
                            <p>Make Sure Nothing Is Obstructing The Face.</p>
                        </div>
                        <div className="vto-instr-item">
                            <div className="vto-instr-icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
                                    <circle cx="12" cy="12" r="4" />
                                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                                </svg>
                            </div>
                            <p>Make Sure That The Lighting Is Not Too Dim Or Too Bright.</p>
                        </div>
                    </div>
                </div>
                <div className="vto-instr-footer">
                    <button className="vto-btn-black-rect" onClick={() => fileInputRef.current?.click()}>UPLOAD PHOTO</button>
                    <input type="file" ref={fileInputRef} onChange={onPhotoUpload} accept="image/*" style={{ display: 'none' }} />
                </div>
            </div>
        </div>
    );
}
