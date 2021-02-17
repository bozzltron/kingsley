interface Response {
    text :string,
    image ?:string,
    speak ?:boolean,
    url ?:string,
    meta ?:Meta,
    sleep ?:boolean
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
    meta ?:Meta,
    face :string,
    conversation :string
}

export { Response, Article, Meta, Session }