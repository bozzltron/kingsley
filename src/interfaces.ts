interface Response {
    text :string,
    image ?:string,
    speak ?:boolean,
    url ?:string,
    meta ?:Meta,
    sleep ?:boolean
}

interface Link {
    url :string
}

interface Article {
    title :string,
    image :string,
    content :string,
    url :string
}

interface Meta {
    articles ?:Array<Link>
}

interface Session {
    id: string,
    active :boolean,
    name :string,
    voice :number,
    city :string,
    newSources :string,
    meta ?:Meta,
    face :string,
    conversation :string
}

interface Inquiry {
    statement: string;
    confidence: number;
    conversation: string;
    personality: string;
}

interface Interaction {
    statement: string;
    response: Response;
}

export { Response, Article, Meta, Session, Link, Inquiry, Interaction }