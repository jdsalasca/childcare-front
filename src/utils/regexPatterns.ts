export class RegexPatterns {

    static namesAndLastNames() : RegExp{
        return /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/;
    }
}