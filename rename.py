import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(content)

replacements = [
    ('Multiplication', 'Division'),
    ('multiplication', 'division'),
    ('generator-standard.js', 'generator-long-division.js'),
    ('solver-ui-standard.js', 'solver-ui-long-division.js'),
    ('hints-player-standard.js', 'hints-player-long-division.js'),
    ('Standard', 'Long Division'),
    ('standard', 'long-division')
]

replace_in_file('division/index.html', replacements)
replace_in_file('division/js/app.js', replacements)

os.rename('division/js/generator-standard.js', 'division/js/generator-long-division.js')
os.rename('division/js/solver-ui-standard.js', 'division/js/solver-ui-long-division.js')
os.rename('division/js/hints-player-standard.js', 'division/js/hints-player-long-division.js')

print("Renamed and replaced!")
