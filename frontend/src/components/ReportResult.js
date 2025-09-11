import React from 'react';

const ReportResult = ({ error, pdfUrl }) => {
  if (error) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        <strong>오류 발생:</strong> {error}
      </div>
    );
  }

  if (pdfUrl) {
    return (
      <div className="card mt-5">
        <div className="card-header">
          <h3>보고서 미리보기</h3>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center flex-column">
          <iframe
            src={pdfUrl}
            title="PDF Report Preview"
            width="100%"
            height="600px"
            style={{ border: '1px solid #ddd' }}
          ></iframe>
          <div className="d-grid mt-3">
            <a href={pdfUrl} download="naver_trend_report.pdf" className="btn btn-success btn-lg">
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
