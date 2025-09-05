const fs = require('fs');

let posts;
try {
    const data = fs.readFileSync('./posts.json', 'utf8');
    posts = JSON.parse(data);
    console.log('Database is loaded.');
} catch (error) {
    console('Error loading database, ', error);
    posts = [];
}

let nextId;
if(posts.length > 0) {
    nextId = Math.max( ...posts.map(p => p.id) ) + 1;
} else {
    nextId = 1;
}

async function saveDataToFile() {
    try {
        const data = JSON.stringify(posts, null, 2);
        await fs.promises.writeFile('./posts.json', data, 'utf8');
    } catch (error) {
        console.log('Error writing to db file. ', error);
    }    
}

module.exports = { posts, nextId, saveDataToFile };