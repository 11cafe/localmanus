local manus 桌面版

## environment 

`cd react && npm i`

```bash
git submodule init
git submodule update
uv venv --python 3.12
source .venv/bin/activate
uv pip install -r server/openmanus/requirements.txt
uv pip install -r server/requirements.txt
playwright install
```

## Development

`cd react && npm run dev`
`cd server && python localmanus/main.py`
