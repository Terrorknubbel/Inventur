## Ideas

```js
// controller
exports.getEntry = (req, res) => {
    ...
}

// routes.js

const entryController = require("./controllers/entryController")

app.get("/entry", entryController.getEntry)
```

## Todos

- [x] :D