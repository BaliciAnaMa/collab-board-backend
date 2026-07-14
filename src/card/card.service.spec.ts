import { CardService } from './card.service';

describe('Testul meu pentru CardService', () => {
  let service: CardService;

  beforeEach(() => {
    // Aici păcălim constructorul cu "null" pentru că testăm doar logica noastră, 
    // nu ne interesează baza de date sau coada în acest test simplu.
    service = new CardService(null as any, null as any, null as any);
  });

  it('verifică dacă numele cardului este formatat corect (litere mari + fără spații)', () => {
    // Ce dau în funcție
    const intrare = '  practica 2026  ';
    const rezultat = service.formatCardName(intrare);
    expect(rezultat).toBe('PRACTICA 2026');
  });

  it('verifică dacă funcționează și cu un cuvânt simplu', () => {
    const rezultat = service.formatCardName('test');
    expect(rezultat).toBe('TEST');
  });
});