import React from 'react';
import Webcam from 'react-webcam';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';

export default function VtoCanvasViewport({
    containerRef,
    webcamRef,
    canvasRef,
    imageRef,
    mode,
    uploadedImage,
    compareMode,
    setCompareMode,
    baPos,
    isDragging,
    statusMsg,
    intensity,
    onIntensityChange,
    onBaDragStart,
    onBaDragMove,
    onBaDragEnd,
    onBackFromCompare,
    onCloseEngine,
    onDownloadImage,
    activeShadeObj,
}) {
    return (
        <>
            <div
                ref={containerRef}
                className="vto-canvas-container"
                onMouseDown={compareMode ? onBaDragStart : undefined}
                onMouseMove={compareMode ? onBaDragMove : undefined}
                onMouseUp={compareMode ? onBaDragEnd : undefined}
                onMouseLeave={compareMode ? onBaDragEnd : undefined}
                onTouchStart={compareMode ? onBaDragStart : undefined}
                onTouchMove={compareMode ? onBaDragMove : undefined}
                onTouchEnd={compareMode ? onBaDragEnd : undefined}
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: compareMode ? (isDragging ? 'ew-resize' : 'col-resize') : 'default',
                    flex: 1,
                    minHeight: 0,
                    '--bottom-controls-pos': activeShadeObj ? '110px' : '30px',
                    '--bottom-controls-pos-mobile': activeShadeObj ? '100px' : '10px',
                    '--status-pos': activeShadeObj ? '110px' : '30px',
                    '--status-pos-mobile': activeShadeObj ? '100px' : '10px'
                }}
            >
                {/* BEFORE Layer – Original camera/image */}
                <div
                    className="vto-ba-before-layer"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        zIndex: 1,
                    }}
                >
                    {mode === 'live' && (
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transform: 'scaleX(-1)',
                            }}
                            videoConstraints={{ facingMode: "user" }}
                        />
                    )}

                    {mode === 'photo' && uploadedImage && (
                        <img
                            ref={imageRef}
                            src={uploadedImage}
                            alt="Uploaded"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    )}
                </div>

                {/* AFTER Layer (Canvas with Makeup) */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        zIndex: 2,
                        clipPath: compareMode
                            ? `inset(0 0 0 ${baPos * 100}%)`
                            : 'none',
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        className="vto-main-canvas"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: mode === 'live' ? 'scaleX(-1)' : 'none',
                            pointerEvents: 'none',
                        }}
                    />
                </div>

                {/* Compare Mode UI Overlay */}
                {compareMode && (
                    <>
                        {/* BEFORE / AFTER Labels */}
                        <div
                            className="vto-compare-pills-container"
                            style={{
                                position: 'absolute',
                                top: '60px',
                                left: 0,
                                right: 0,
                                zIndex: 10,
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0 16px',
                                pointerEvents: 'none',
                            }}
                        >
                            <div style={{
                                background: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '20px',
                                padding: '8px 18px',
                                fontSize: '12px',
                                fontWeight: 700,
                                letterSpacing: '1px',
                                backdropFilter: 'blur(4px)',
                                WebkitBackdropFilter: 'blur(4px)',
                                marginTop: '15px'
                            }}>
                                BEFORE
                            </div>
                            <div style={{
                                background: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontSize: '12px',
                                fontWeight: 700,
                                letterSpacing: '1px',
                                backdropFilter: 'blur(4px)',
                                WebkitBackdropFilter: 'blur(4px)',
                                marginTop: '15px'
                            }}>
                                AFTER
                            </div>
                        </div>

                        {/* Back Button in Compare Mode */}
                        <button
                            onClick={onBackFromCompare}
                            className="vto-compare-back-btn"
                            style={{
                                position: 'absolute',
                                top: '24px',
                                left: '12px',
                                zIndex: 15,
                                background: 'rgba(0,0,0,0.65)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                borderRadius: '8px',
                                color: '#fff',
                                padding: '8px 14px',
                                fontSize: '13px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                backdropFilter: 'blur(6px)',
                                WebkitBackdropFilter: 'blur(6px)',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <FaArrowLeft size={14} />
                            Back
                        </button>

                        {/* Divider Line */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: `${baPos * 100}%`,
                                width: '3px',
                                background: 'rgba(255,255,255,0.9)',
                                boxShadow: '0 0 12px rgba(0,0,0,0.5), 0 0 4px rgba(0,0,0,0.3)',
                                zIndex: 10,
                                transform: 'translateX(-50%)',
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Draggable Handle */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: `${baPos * 100}%`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 11,
                                pointerEvents: 'none',
                            }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.95)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                                border: '2px solid rgba(0,0,0,0.1)',
                            }}>
                                <div style={{ display: 'flex', gap: '3px' }}>
                                    <div style={{ width: '3px', height: '16px', background: '#333', borderRadius: '2px' }} />
                                    <div style={{ width: '3px', height: '16px', background: '#333', borderRadius: '2px' }} />
                                </div>
                            </div>
                        </div>

                        {/* Touch drag strip */}
                        <div
                            onMouseDown={onBaDragStart}
                            onTouchStart={onBaDragStart}
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: `${baPos * 100}%`,
                                width: '60px',
                                transform: 'translateX(-50%)',
                                zIndex: 12,
                                cursor: 'ew-resize',
                            }}
                        />
                    </>
                )}

                {!compareMode && <div className="vto-status" style={{ zIndex: 20 }}>{statusMsg}</div>}
            </div>

            {/* Intensity slider */}
            {!compareMode && (
                <div className="vto-intensity-slider-wrap">
                    <div className="vto-slider-track-thin">
                        <input
                            type="range"
                            className="vto-vertical-slider-thin"
                            min="0"
                            max="100"
                            value={intensity}
                            onChange={onIntensityChange}
                        />
                    </div>
                    <div className="vto-slider-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="white" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Compare & Close Controls */}
            {!compareMode && (
                <div className="vto-top-controls-v2">
                    <button className="vto-compare-btn" onClick={() => setCompareMode(true)}>COMPARE</button>
                    <button className="vto-close-btn-v2" onClick={onCloseEngine}><FaTimes /></button>
                </div>
            )}

            {/* Download Screenshot Control */}
            <div className="vto-bottom-controls-v2">
                <button className="vto-download-btn-v2" onClick={onDownloadImage}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 15V19H5V15H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15H19ZM13 12.67L15.59 10.09L17 11.5L12 16.5L7 11.5L8.41 10.09L11 12.67V3H13V12.67Z" fill="white" />
                    </svg>
                </button>
            </div>
        </>
    );
}
