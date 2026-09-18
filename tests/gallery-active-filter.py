"""
Integration tests for the Syaflower Shop gallery filter bar.

Feature: syaflower-shop, Property 3: Active filter button is exclusively highlighted
Validates: Requirements 5.5

After each filter button click, exactly one `.filter-btn--active` must exist
in the DOM and it must be the button that was just clicked.

Run with:
    python tests/gallery-active-filter.py
"""

import os
import sys
import time
from playwright.sync_api import sync_playwright, expect

# Resolve absolute file:/// URL to .kiro/index.html
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)
index_html_path = os.path.join(project_root, ".kiro", "index.html")
INDEX_URL = "file:///" + index_html_path.replace("\\", "/")

FILTER_VALUES = ["all", "roses", "tulips", "bouquets", "wedding", "seasonal"]

# ──────────────────────────────────────────────────────────────────────────────
# Simple test runner (no pytest dependency required)
# ──────────────────────────────────────────────────────────────────────────────
passed = []
failed = []


def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # ── Individual filter click tests ──────────────────────────────────────
        for filter_value in FILTER_VALUES:
            test_name = (
                f'clicking "{filter_value}" button → '
                f'exactly one active button, matching data-filter="{filter_value}"'
            )
            page = context.new_page()
            try:
                page.goto(INDEX_URL)
                # Wait for renderGallery() — product cards must exist
                page.wait_for_selector(".product-card", timeout=5000)

                # Click the target filter button
                page.locator(f'.filter-btn[data-filter="{filter_value}"]').click()

                # Wait 200 ms for any CSS transitions
                page.wait_for_timeout(200)

                # Assert: exactly one .filter-btn--active
                active_buttons = page.locator(".filter-btn--active")
                count = active_buttons.count()
                assert count == 1, (
                    f"Expected exactly 1 .filter-btn--active but found {count}"
                )

                # Assert: the active button's data-filter matches what was clicked
                active_data_filter = active_buttons.first.get_attribute("data-filter")
                assert active_data_filter == filter_value, (
                    f"Expected data-filter='{filter_value}' "
                    f"but active button has data-filter='{active_data_filter}'"
                )

                passed.append(test_name)
                print(f"  ✓ {test_name}")
            except Exception as exc:
                failed.append((test_name, str(exc)))
                print(f"  ✗ {test_name}")
                print(f"      {exc}")
            finally:
                page.close()

        # ── Sequential click-through test ─────────────────────────────────────
        seq_test_name = "clicking through all filters in sequence always leaves exactly one active"
        page = context.new_page()
        try:
            page.goto(INDEX_URL)
            page.wait_for_selector(".product-card", timeout=5000)

            for filter_value in FILTER_VALUES:
                page.locator(f'.filter-btn[data-filter="{filter_value}"]').click()
                page.wait_for_timeout(200)

                active_buttons = page.locator(".filter-btn--active")
                count = active_buttons.count()
                assert count == 1, (
                    f"After clicking '{filter_value}': "
                    f"Expected 1 .filter-btn--active, found {count}"
                )
                active_data_filter = active_buttons.first.get_attribute("data-filter")
                assert active_data_filter == filter_value, (
                    f"After clicking '{filter_value}': "
                    f"Expected data-filter='{filter_value}', "
                    f"got '{active_data_filter}'"
                )

            passed.append(seq_test_name)
            print(f"  ✓ {seq_test_name}")
        except Exception as exc:
            failed.append((seq_test_name, str(exc)))
            print(f"  ✗ {seq_test_name}")
            print(f"      {exc}")
        finally:
            page.close()

        context.close()
        browser.close()


if __name__ == "__main__":
    print()
    print("Property 3: Active filter button is exclusively highlighted")
    print("=" * 65)
    print(f"Loading: {INDEX_URL}")
    print()

    run_tests()

    total = len(passed) + len(failed)
    print()
    print("=" * 65)
    print(f"Results: {len(passed)}/{total} passed")

    if failed:
        print()
        print("FAILURES:")
        for name, msg in failed:
            print(f"  • {name}")
            print(f"    {msg}")
        sys.exit(1)
    else:
        print("All tests passed ✓")
        sys.exit(0)
