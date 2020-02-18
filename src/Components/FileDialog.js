import React, { Component } from "react";

export default class FileDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { logo } = this.props;
    return (
      <div
        className="message-input-container"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end"
        }}
      >
        <input
          type="file"
          id="file"
          ref="fileUploader"
          accept="image/png, image/jpeg"
          style={{ width: "80%" }}
        />
        <div
          className={`send-button  ${logo === "bolt" ? "" : "notbolt"}`}
          onClick={e => {
            if (this.handleTouchStart) {
              setTimeout(() => {
                this.handleTouchStart = false;
              }, 1000);
              e.preventDefault();
              return;
            }
            this.handleTouchStart = true;
            this.upload();
          }}
        >
          Go
        </div>
      </div>
    );
  }
  upload = () => {
    const { upload, message } = this.props;
    let file = document.getElementById("file").files[0];
    if (file) upload(file);
  };
}
