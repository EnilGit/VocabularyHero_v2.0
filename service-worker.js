const CACHE_NAME =
    "VocabularyHero";

const FILES_TO_CACHE = [

    "./",
    "./index.html",
    "./app.js",
    "./styles.css",

    "./manifest.json",

    "./vocabulary.json",
    "./pickUpB.json",
    "./unit1.json"

];

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )

            .then(cache =>
                cache.addAll(
                    FILES_TO_CACHE
                )
            )
        );
    }
);

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )

            .then(response =>

                response ||

                fetch(
                    event.request
                )
            )
        );
    }
);
