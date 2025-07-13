export class RegexPatterns {
    static namesAndLastNames() : RegExp{
        // Allow letters, spaces, Spanish accents, hyphens, and apostrophes
        return /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s'-]+$/;
    }
}