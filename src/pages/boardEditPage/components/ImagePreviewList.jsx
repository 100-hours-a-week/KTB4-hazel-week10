function ImagePreviewList({ currentImages, newImages, onDeleteCurrentImage, onDeleteNewImage }) {
  if (!currentImages.length && !newImages.length) {
    return null;
  }

  return (
    <div className="image-preview-list">
      {currentImages.map((imageUrl, index) => (
        <div key={`${imageUrl}-${index}`} className="image-preview">
          <span className="image-preview__text">{imageUrl}</span>

          <button
            className="image-preview__delete-button"
            type="button"
            onClick={() => onDeleteCurrentImage(index)}
          >
            삭제
          </button>
        </div>
      ))}

      {newImages.map((file, index) => (
        <div
          key={`${file.name}-${file.lastModified}-${index}`}
          className="image-preview"
        >
          <span className="image-preview__text">{file.name}</span>

          <button
            className="image-preview__delete-button"
            type="button"
            onClick={() => onDeleteNewImage(index)}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}

export default ImagePreviewList;
