document.getElementById('getFortune').addEventListener('click', () => {
    fetch('/fortune')
        .then(response => response.json())
        .then(data => {
            document.getElementById('fortune').textContent = data.fortune;
        })
        .catch(error => {
            console.error('운세를 가져오는데 실패했습니다:', error);
            document.getElementById('fortune').textContent = '운세를 가져오는데 실패했습니다.';
        });
});