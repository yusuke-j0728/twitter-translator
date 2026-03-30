import SwiftUI

struct ContentView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Image(systemName: "globe")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .foregroundColor(.blue)
                    .padding(.top, 40)

                Text("Twitter Translator")
                    .font(.largeTitle)
                    .fontWeight(.bold)

                Text("Safari上でツイートを自動翻訳")
                    .font(.title3)
                    .foregroundColor(.secondary)

                VStack(alignment: .leading, spacing: 16) {
                    SetupStepView(
                        number: 1,
                        title: "設定アプリを開く",
                        description: "「設定」→「Safari」→「機能拡張」に移動"
                    )
                    SetupStepView(
                        number: 2,
                        title: "拡張機能を有効化",
                        description: "「Twitter Translator」をオンにする"
                    )
                    SetupStepView(
                        number: 3,
                        title: "権限を許可",
                        description: "twitter.com と x.com へのアクセスを許可"
                    )
                    SetupStepView(
                        number: 4,
                        title: "Safariで使う",
                        description: "twitter.com / x.com を開くと自動翻訳開始。ツールバーのアイコンから設定変更可能"
                    )
                }
                .padding()
                .background(Color(.systemGroupedBackground))
                .cornerRadius(12)
                .padding(.horizontal)

                Spacer()
            }
        }
    }
}

struct SetupStepView: View {
    let number: Int
    let title: String
    let description: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Text("\(number)")
                .font(.headline)
                .foregroundColor(.white)
                .frame(width: 28, height: 28)
                .background(Color.blue)
                .clipShape(Circle())

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
    }
}
