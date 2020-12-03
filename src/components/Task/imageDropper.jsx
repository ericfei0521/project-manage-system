import React from "react";

const ImageDropper = () => {
  return (
    <form action="">
      <input
        type="file"
        id="fileElem"
        multiple
        accept="image/*"
        onchange="handleFiles(this.files)"
      />
      <label class="button" for="fileElem"></label>
    </form>
  );
};

export default ImageDropper;
