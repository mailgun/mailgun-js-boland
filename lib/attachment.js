function Attachment(data, filename) {
  if (Buffer.isBuffer(data)) {
    this.data = data;
  }
  this.filename = filename;
}

module.exports = Attachment;