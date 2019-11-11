const base_url = 'https://readerapi.codepolitan.com/';

// Blok kode yg akan di panggil jika fetch berhasil
status = response => {
  if (response.status !== 200) {
    console.log('Error : ' + status);
    // Method reject() akan membuat blok fetch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi promise agab bisa di 'then' kan
    return Promise.resolve(response);
  }
};

// Blok kode untuk memparsing json menjadi array
json = response => {
  return response.json();
};

// Blok kode untuk menghandle kesalahan di blok catch
err = error => {
  // Parameter error berasal dari Promise.reject()
  console.log('Error : ' + error);
};

// Blok kode untuk melakukan request data json
getArticles = () => {
  if ('caches' in window) {
    caches.match(base_url + 'articles').then(response => {
      if (response) {
        response.json().then(data => {
          let articlesHTML = '';
          data.result.forEach(article => {
            articlesHTML += `
              <div class="card">
                <a href="./article.html?id=${article.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${article.thumbnail}" />
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${article.title}</span>
                </div>
              </div>
            `;
          });
          // Sisipkan komponen card ke dalam element dgn id content
          document.getElementById('body-content').innerHTML = articlesHTML;
        });
      }
    });
  }

  fetch(base_url + 'articles')
    .then(status)
    .then(json)
    .then(data => {
      // Objek atau array JS dari response.json() masuk lewat parameter data

      // Menyusun komponen card artikel secara dinamis
      let articlesHTML = '';
      data.result.forEach(article => {
        articlesHTML += `
                    <div class="card">
                        <a href="./article.html?id=${article.id}">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img src="${article.thumbnail}" />
                            </div>
                        </a>
                        <div class="card-content">
                            <span class="card-title truncate">${article.title}</span>
                            <p>${article.description}</p>
                        </div>
                    </div>
                `;
      });
      // Sisipkan komponen card ke dalam element dgn id body-content
      document.getElementById('articles').innerHTML = articlesHTML;
    })
    .catch(err);
};

// Blok kode untuk melakukan request data article
getArticleById = () => {
  // Ambil nilai query parameter (?id=)
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id');

  fetch(base_url + 'article/' + idParam)
    .then(status)
    .then(json)
    .then(data => {
      // Objek javascript dari response.json masuk lewat variable data
      console.log(data);
      // Menyusun komponen card secara dinamis
      const articleHTML = `
        <div class="card">
          <div class="card-image waves-effect waves-block waves-light">
            <img src="${data.result.cover}" />
          </div>
          <div class="card-content">
            <span class="card-title">${data.result.post_title}</span>
            ${snarkdown(data.result.post_content)}
          </div>
        </div>
      `;
      // Sisipkan komponen card ke dalam elemen dengan id content
      document.getElementById('body-content').innerHTML = articleHTML;
    });
};
