var apiClient = (function() {
    function request(uri, method, headers, payload) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, uri, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = (event) => {
                const xhr = event.target;
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            resolve(JSON.parse(xhr.responseText));
                        } catch (e) {
                            reject(e);
                        }
                    } else if (xhr.status > 400) {
                        reject(xhr.responseText);
                    }
                }
            };
            if (payload) {
                xhr.send(JSON.stringify(payload));
            } else {
            xhr.send(null);
            }
        });
    }

    function startGame(columns, rows, mines) {
        const gameOptions = {
            columns,
            rows,
            mines
        };
        return request('/start', 'POST', null, gameOptions);
    }

    function reveal(column, row) {
        return request(`/reveal/${column}/${row}`, 'POST');
    }

    function flag(column, row) {
        return request(`/flag/${column}/${row}`, 'POST');
    }

    return {
        startGame,
        reveal,
        flag
    };

})();
