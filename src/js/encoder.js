const testData = new Uint8Array(fs.readFileSync("test.mkv"));
// Encode test video to VP8.
const result = ffmpeg({
    MEMFS: [{ name: "test.mkv", data: testData }],
    mounts: [{ type: "NODEFS", opts: { root: "." } }],
    arguments: ["-i", "test.mkv", "-c", "copy", "out.mp4"],
});
// Write out.webm to disk.
const out = result.MEMFS[0];
fs.writeFileSync(out.name, Buffer(out.data));