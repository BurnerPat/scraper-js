# scraper-js

A simple module to scrape websites. Uses cheerio to provide jQuery-like features.

## Example

```javascript
const Scraper = require("./main");

const scraper = new Scraper("http://my.cool.page/", {
    /* Use jQuery paths */
    title: "h1.title",
    
    /* Nested objects */
    nested: {
        title: "div.nested h2"
    },
    
    /* It is possible to switch contexts in order to shorten the selectors */
    contact: {
        /* Context switch */
        $: "div.contact",
        
        /* Instead of "div.contact .name" */
        name: ".name",
        address: ".address"
    },
    
    /* Arrays can be constructed using context switch ($) */
    keys: [
        {
            /* For each element matched by $... */
            $: "table > tbody > tr",
            
            /* ... construct the following object */
            id: "td:nth-child(1)",
            key: "td:nth-child(2)",
            name: "td:nth-child(3)",
            region: "td:nth-child(4)",
            type: "td:nth-child(5)"
        }
    ]
});

/* API uses promises */
scraper.execute().then(e => {
    console.log(JSON.stringify(e, null, 2));
}).catch(console.error.bind(console));
```