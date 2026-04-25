# Defining the code file encoding

You can define the code file encoding with `encoding` attribute.
Default — `'utf8'`.

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include-code` directive.

::include-code{file="./included1.bat" language="batchfile" encoding="CP866"}

_That_ should do it!

```

included1.bat:

```batchfile
echo "Кириллический текст"

```

Remark output:

````markdown
Hello. I am an main markdown file with `::include-code` directive.

```batchfile
echo "Кириллический текст"

```

*That* should do it!

````
