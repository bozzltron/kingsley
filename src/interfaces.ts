interface Response {
    text :string,
    image ?:string,
    speak ?:boolean,
    url ?:string,
    meta ?:Meta
}

interface Article {
    title :string,
    source: {
        name :string
    },
    urlToImage :string,
    content :string
}

interface Meta {
    articles ?:Array<Article>
}

interface Session {
    active :boolean,
    name :string,
    voice :number,
    city :string,
    newSources :string,
    meta ?:Meta
}

export { Response, Article, Meta, Session }