const fs = require('fs')
const youtubedl = require('youtube-dl')
const { makeid } = require("./make_random_id.js")
module.exports = youtube_downloader = async (youtube_link, client, id, message_id) => {
  try {
    let caption = 'הסרטון שלך מוכן 📹'
    let filename = 'myvideo' + makeid(5) + ".mp4"
    const video = youtubedl(youtube_link,
      // Optional arguments passed to youtube-dl.
      ['--format=18'],
      // Additional options can be given for calling `child_process.execFile()`.
      { cwd: __dirname })

    // Will be called when the download starts.
    await video.on('info', function (info) {
      console.log('Download started')
      console.log('filename: ' + info._filename)
      caption = info._filename
      console.log('size: ' + info.size);
    })
    video.on("next",(data) => {
      console.log(data)
    })
    video.pipe(fs.createWriteStream(filename))
    video.on('end', function () {
      client.sendFile(id, filename, filename, caption, message_id).then((str) => {
        console.log("Finished download " + filename + " from " + youtube_link)
        fs.unlink(filename, (err) => {
          if (err) {
            console.error(err)
            return
          }
        })
      }
        , (err) => {
          client.sendText(id, "אוי, לא הצלחתי לשלוח לך את הסרטון 😞\n\n" +
          "אם זה מעניין אותך, זה התקלה שנתקלתי בה:\n"
          + err)
          console.log("youtube_downloader has error ".red + err)
        }
      )

    })
  }
  catch (error) {
    console.log("youtube_downloader(1) has error".red + error)
    client.sendText(id, "אוי, לא הצלחתי לשלוח לך את הסרטון 😞\n\n" +
      "אם זה מעניין אותך, זה התקלה שנתקלתי בה:\n"
      + error)

  }
}
