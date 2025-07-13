export class RegexPatterns {
    static namesAndLastNames() : RegExp{
        // Allow letters, spaces, and Spanish accents, but not hyphens or apostrophes
        return /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/;
    }
}