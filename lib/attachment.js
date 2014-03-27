/**
 * Creates an Attachment object.
 * @param data Buffer representing attachment data
 * @param filename the filename to be used as attachment filename
 * @constructor
 */
function Attachment(data, filename) {
  if (Buffer.isBuffer(data)) {
    this.data = data;
  }
  this.filename = filename;
}

module.exports = Attachment;