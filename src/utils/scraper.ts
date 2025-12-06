import { getAverageColor } from "fast-average-color-node";

export async function getBookColor(url: string) {
    const color = await getAverageColor(url)
    return color.hex
}

export async function getBookInfoByURL(url: string) {
    const fetchResponse = await fetch(url);
    if (!fetchResponse.ok) return { error: "Failed to fetch URL", status: 400 as const };

    // Get book information from scraper
    const html = await fetchResponse.text();
    const bookInfo = await scrapeBookInfo(html);
    const coverColor = await getBookColor(bookInfo.imageUrl);

    if (!bookInfo || !coverColor) return {
        error: "Failed to fetch book information", status: 500 as const
    }

    return {
        message: "Book information fetched successfully",
        book: {
            title: bookInfo.title,
            author: bookInfo.author,
            imageUrl: bookInfo.imageUrl,
            color: coverColor,
            description: bookInfo.description
        }
    };
}

export async function scrapeBookInfo(htmlString: string) {
    let title = "";
    let author = "";
    let imageUrl = "";
    let description = "";

    // Extract book information
    const scrape = new HTMLRewriter()
        .on("[data-id=productDetailTitle]", {
            text(chunk) {
                if (chunk.text) {
                    title += chunk.text;
                }
            },
        })
        .on("[data-testid=productDetailAuthor]", {
            text(chunk) {
                if (chunk.text) {
                    author += chunk.text;
                }
            }
        })
        .on('[data-id="productDetailImage#0"]', {
            element(el) {
                if (el.hasAttribute("src")) {
                    const rawImageUrl = el.getAttribute("src")?.toString().split("/plain/")[1];
                    imageUrl += rawImageUrl
                }
            }
        })
        .on('[data-testid="productDetailDescriptionContainer"]', {
            text(chunk) {
                if (chunk.text) {
                    description += chunk.text
                }
            }
        })

    const res = new Response(htmlString);
    const transformed = scrape.transform(res);
    await transformed.text();

    return {
        title: title.trim(),
        author,
        imageUrl,
        description
    };
}