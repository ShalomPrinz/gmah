import { get } from "./http"

async function getFamiliesCount() {
    return get('familiesCount')
}

export { getFamiliesCount }