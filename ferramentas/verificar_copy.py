"""Compara a copy e as informacoes de uma pagina original com a nova.
Ignora o que e decorativo (aria-hidden) e a marcacao HTML.

Uso:
    pip install beautifulsoup4
    python ferramentas/verificar_copy.py ORIGINAL.html NOVO.html [ORIGINAL2.html NOVO2.html ...]

Exemplo (pasta antiga ao lado desta):
    python ferramentas/verificar_copy.py ../henryt/index.html index.html

Diferencas em "meta" e "links_head" sao so avisos (theme-color e
preload de fontes mudaram com o design). Qualquer outra diferenca
significa que texto, link, imagem ou rotulo de acessibilidade mudou."""
import sys, re, difflib
from bs4 import BeautifulSoup, Comment

def texto_visivel(soup):
    for t in soup(['script', 'style', 'head']): t.decompose()
    for t in soup.find_all(attrs={'aria-hidden': 'true'}): t.decompose()
    for c in soup.find_all(string=lambda x: isinstance(x, Comment)): c.extract()
    txt = soup.body.get_text(' ')
    return re.sub(r'\s+', ' ', txt).strip()

def infos(soup):
    r = {}
    r['title'] = soup.title.get_text(strip=True)
    r['meta'] = sorted((m.get('name') or m.get('property'), m.get('content')) for m in soup.find_all('meta') if m.get('content'))
    r['links_head'] = sorted((' '.join(l.get('rel')), l.get('href')) for l in soup.find_all('link'))
    b = soup.body
    r['hrefs'] = [a.get('href') for a in b.find_all('a')]
    r['targets'] = [(a.get('href'), a.get('target'), a.get('rel') and ' '.join(a.get('rel'))) for a in b.find_all('a') if a.get('target')]
    r['imgs'] = [(i.get('src'), i.get('alt')) for i in b.find_all('img')]
    r['sources'] = [s.get('srcset') for s in b.find_all('source')]
    r['aria'] = [e.get('aria-label') for e in b.find_all(attrs={'aria-label': True})]
    r['ids'] = [e.get('id') for e in b.find_all(id=True)]
    return r

ok = True
for orig, novo in [(a, b) for a, b in zip(sys.argv[1::2], sys.argv[2::2])]:
    so = BeautifulSoup(open(orig, encoding='utf-8').read(), 'html.parser')
    sn = BeautifulSoup(open(novo, encoding='utf-8').read(), 'html.parser')
    io, inn = infos(so), infos(sn)
    to, tn = texto_visivel(so), texto_visivel(sn)
    print(f'== {novo}')
    if to == tn:
        print('   texto visível: IDÊNTICO (%d caracteres)' % len(to))
    else:
        ok = False
        print('   texto visível: DIFERENTE')
        for l in difflib.unified_diff(to.split(' '), tn.split(' '), lineterm='', n=4):
            print('     ', l)
    for k in io:
        if io[k] == inn[k]:
            print(f'   {k}: igual')
        else:
            so_o = [x for x in io[k] if x not in inn[k]] if isinstance(io[k], list) else io[k]
            so_n = [x for x in inn[k] if x not in io[k]] if isinstance(inn[k], list) else inn[k]
            print(f'   {k}: DIFERENTE\n      só no original: {so_o}\n      só no novo:     {so_n}')
            if k not in ('meta', 'links_head'): ok = False
print('\nRESULTADO:', 'OK' if ok else 'HÁ DIFERENÇAS')
