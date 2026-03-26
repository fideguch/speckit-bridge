# speckit-bridge

requirements_designer の出力（`designs/`）を [GitHub spec-kit](https://github.com/github/spec-kit) の仕様書形式に変換するスキル。

## 何をするスキルか

PMが `/requirements_designer` で作った要件ドキュメント（7ファイル）を、エンジニアが `specify plan → tasks → implement` で実装できる形式（`spec.md` + `constitution.md`）に自動変換します。

```
/requirements_designer → designs/ (PM成果物)
        ↓
/speckit-bridge → spec.md + constitution.md (Engineer入力)
        ↓
/speckit.plan → plan.md, data-model.md, contracts/
        ↓
/speckit.tasks → tasks.md
        ↓
/speckit.implement → コード
```

## 前提条件

- `/requirements_designer` で `designs/` が生成済みであること
- 品質スコアが 70 点以上（推奨）
- spec-kit CLI がインストール済みであること

```bash
# spec-kit CLI のインストール（初回のみ）
# ⚠️ PyPI の "specify" は別パッケージです。必ず以下のコマンドを使ってください。
uv tool install specify-cli --from "git+https://github.com/github/spec-kit.git@v0.4.3"

# uv がない場合は先にインストール
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## 使い方

### 基本

```
要件をspec-kitに変換して
```

または

```
/speckit-bridge
```

### トリガーワード

- `speckit-bridge` / `spec-kit変換` / `仕様変換`
- `要件をspec-kitに変換` / `spec.mdを生成`
- `エンジニアに渡せる形にして`
- `bridge to spec-kit` / `convert to spec`

## 変換マッピング

| designs/ ファイル | 変換先 | 内容 |
|---|---|---|
| `README.md` | `constitution.md` | プロジェクト原則・制約 |
| `README.md` | `spec.md` Success Criteria | 成功指標 → SC-001 形式 |
| `functional_requirements.md` | `spec.md` Functional Requirements | FR-001 → "System MUST" 形式 |
| `user_stories.md` | `spec.md` User Scenarios | US → User Story (P1/P2/P3) |
| `non_functional_requirements.md` | `spec.md` Assumptions | NFR 目標値を制約として |
| `ubiquitous_language.md` | `spec.md` Key Entities | UL 用語 → エンティティ |
| `ui_design_brief.md` | 変換対象外 | Figma 成果物として別管理 |

## 生成されるファイル

```
.specify/
  memory/
    constitution.md          ← プロジェクトの開発原則
specs/
  [feature-name]/
    spec.md                  ← 統合仕様書
    checklists/
      requirements.md        ← 品質チェックリスト
```

## 品質ゲート

- 品質スコア 70 点以上: そのまま変換
- 品質スコア 70 点未満: 警告を表示、ユーザー判断で続行可
- 品質スコア未算出（`-/100`）: `/requirements_designer` の Phase 4A 実行を推奨

## 変換後の次のステップ

| コマンド | 誰が実行 | 生成物 |
|---------|---------|--------|
| `/speckit.plan` | Tech Lead | plan.md, data-model.md, contracts/ |
| `/speckit.tasks` | Tech Lead | tasks.md（依存関係付き） |
| `/speckit.clarify` | PM | [NEEDS CLARIFICATION] の解決 |
| `/speckit.implement` | Engineer | コード |

## 関連スキル

- `/requirements_designer` — 要件定義（このスキルの入力を生成）
- `/writing-plans` — 実装計画（spec-kit を使わない場合の代替）
- `/brainstorming` — アイデアが固まらない段階で使用
