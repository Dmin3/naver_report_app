import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// PDF.js worker 설정 (최신 .mjs 파일 경로로 수정)
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

const ReportResult = ({ error, pdfBlob }) => {
  const [numPages, setNumPages] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    let objectUrl = '';
    if (pdfBlob) {
      // 다운로드용 URL 생성
      objectUrl = URL.createObjectURL(pdfBlob);
      setDownloadUrl(objectUrl);
    }
    
    // Cleanup 함수: 컴포넌트가 언마운트될 때 URL을 해제하여 메모리 누수 방지
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [pdfBlob]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        <strong>오류 발생:</strong> {error}
      </div>
    );
  }

  if (pdfBlob) {
    return (
      <div className="card mt-5">
        <div className="card-header">
          <h3>보고서 미리보기</h3>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center flex-column">
          <div style={{ border: '1px solid #000000ff', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <Document
              file={pdfBlob}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<p>PDF를 불러오는 중입니다...</p>}
              error={<p>PDF를 불러오는 데 실패했습니다.</p>}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={Math.min(window.innerWidth * 0.8, 800)} // 화면 너비에 맞게 조절
                />
              ))}
            </Document>
          </div>
          <div className="d-grid mt-3">
            <a href={downloadUrl} download="naver_trend_report.pdf" className="btn btn-success btn-lg">
              PDF 다운로드
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ReportResult;