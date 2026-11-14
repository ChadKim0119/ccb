app=open('app.js',encoding='utf8').read().replace('  /*__ENGINE__*/\n',open('engine.js',encoding='utf8').read()).replace('  /*__EDITOR__*/\n',open('editor.js',encoding='utf8').read())
head=open('shell_head.html',encoding='utf8').read().replace('</style>',open('extra.css',encoding='utf8').read()+'</style>',1)
open('page.html','w',encoding='utf8').write(head+'<script id="data" type="application/json">/*__DATA__*/</script>\n<script>\n'+app+'</script>\n</body>\n</html>\n')
