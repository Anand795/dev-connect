const express = require('express')

const app = express();

app.get('/', (req, res) => res.send('API Running'))

// will get the port no=umber from heroko and by defaiult it is 5000
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))