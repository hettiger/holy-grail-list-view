export interface Item {
    thumbnail?: string;
    title?: string;
    randomText?: string;
    type: "loading-indicator" | "item" | "end";
}