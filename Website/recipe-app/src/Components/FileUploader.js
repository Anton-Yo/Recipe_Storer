
// import React, {useRef} from 'react'
// import '../App.css'


// const FileUploader = ({onFileSelect}) => {
//   const fileInput = useRef(null)

//   const handleFileInput = (e) => {
//     const file = e.target.files[0];
//     if(file.size > 5120)
//       onFileSelectError({error: "File size cannot exceed more than 5MB"});
//     else onFileSelectSuccess(file);
//   }

//   return (
//     <div className="file-uploader">
//         <input type="file" onChange={handleFileInput}></input>
//         <button onClick={e => fileInput.current && fileInput.current.click()} className="btn btn-primary"></button>
//     </div>
//   )
// }

// export default FileUploader;