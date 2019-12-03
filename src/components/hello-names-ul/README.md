This component is a composite of the HelloName atomic component.

It uses basic html components and requires explicit CSS to be passed in via style prop.

### Simple example

```js
<HelloNamesUl names={["World", "🍕"]} />
```

### Complex example

```js
const style = {
  color: '#014263',
  listStyle: 'none',
  textDecoration: 'underline',
};

<HelloNamesUl names={["World", "🍕"]} style={style} />
```