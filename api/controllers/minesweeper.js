function start(req, res) {
    const gameOptions = req.swagger.params.gameOptions.value;
    res.json({success: true});
}

function reveal(req, res) {
    const column = req.swagger.params.column.value;
    const row = req.swagger.params.row.value;
    res.json({});
}

module.exports = {
    start,
    reveal
};
