import './App.css';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

function App() {
  const [parsedCsvData, setParsedCsvData] = useState([]);

  const parseFile = file => {
    Papa.parse(file, {
      header: true,
      complete: async results => {
        setParsedCsvData(results.data);
      },
    });
  };

  console.log(parsedCsvData);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length) {
      parseFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: 'text/csv',
  });

  return (
    <div className="App">
      <div
        {...getRootProps({
          className: `dropzone 
          ${isDragAccept && 'dropzoneAccept'} 
          ${isDragReject && 'dropzoneReject'}`,
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <button disabled>Import</button>
      <div>
        {parsedCsvData &&
          parsedCsvData.map(parsedData => <p>{parsedData.Kanji}</p>)}
      </div>
    </div>
  );
}

export default App;
